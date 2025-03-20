import { courseBuyService } from '@/services/coursebuy.service';
import { userService } from '@/services/user.service';

interface CourseAssignmentParams {
  courseId: string;
  studentId: string;
  renewalDate?: string;
}

interface BulkCourseAssignmentParams {
  courseId: string;
  studentIds: string[];
  renewalDate?: string;
}

export class CourseAssignmentUtil {
  /**
   * Asigna un curso pagado a un estudiante
   * @param params Parámetros de asignación
   * @returns Promise<void>
   */
  static async assignCourseToStudent(params: CourseAssignmentParams): Promise<void> {
    try {
      const { courseId, studentId, renewalDate } = params;
      
      // Verificar si el estudiante ya está enrolado en el curso
      const isEnrolled = await userService.isEnrolledInCourse(studentId, courseId);
      if (isEnrolled) {
        throw new Error('El estudiante ya está enrolado en este curso');
      }

      // Crear la compra del curso
      const currentDate = new Date().toISOString();
      const courseBuyData = {
        subscriptionId: null,
        fecha_adquisicion: currentDate,
        renovacion: renewalDate || null,
        estudianteId: studentId,
        courseId: courseId
      };

      await courseBuyService.create(courseBuyData);

      // Enrolar al estudiante en el curso
      await userService.enrollInCourse(studentId, courseId);
    } catch (error) {
      console.error('Error al asignar curso al estudiante:', error);
      throw error;
    }
  }

  /**
   * Asigna un curso pagado a múltiples estudiantes
   * @param params Parámetros de asignación masiva
   * @returns Promise<void>
   */
  static async assignCourseToMultipleStudents(params: BulkCourseAssignmentParams): Promise<void> {
    try {
      const { courseId, studentIds, renewalDate } = params;
      
      // Crear un array de promesas para asignar el curso a cada estudiante
      const assignmentPromises = studentIds.map(studentId => 
        this.assignCourseToStudent({
          courseId,
          studentId,
          renewalDate
        })
      );

      // Ejecutar todas las asignaciones en paralelo
      await Promise.all(assignmentPromises);
    } catch (error) {
      console.error('Error al asignar curso a múltiples estudiantes:', error);
      throw error;
    }
  }

  /**
   * Verifica si un estudiante tiene acceso a un curso
   * @param courseId ID del curso
   * @param studentId ID del estudiante
   * @returns Promise<boolean>
   */
  static async hasCourseAccess(courseId: string, studentId: string): Promise<boolean> {
    try {
      // Verificar si el estudiante está enrolado
      const isEnrolled = await userService.isEnrolledInCourse(studentId, courseId);
      if (!isEnrolled) return false;

      // Verificar si existe una compra válida
      const purchases = await courseBuyService.findByUser(studentId);
      return purchases.some(purchase => 
        purchase.courseId === courseId && 
        new Date(purchase.renovacion) > new Date()
      );
    } catch (error) {
      console.error('Error al verificar acceso al curso:', error);
      throw error;
    }
  }

  /**
   * Asigna múltiples cursos a un estudiante
   * @param studentId ID del estudiante
   * @param courseIds Array de IDs de cursos
   * @param renewalDate ID opcional de la suscripción
   * @returns Promise<void>
   */
  static async assignMultipleCoursesToStudent(
    studentId: string,
    courseIds: string[],
    renewalDate?: string
  ): Promise<void> {
    try {
      const currentDate = new Date().toISOString();
      const user = await userService.findOne(studentId);
      if (!user) throw new Error("Usuario no encontrado");

      // Obtener las compras existentes del usuario
      const existingPurchases = await courseBuyService.findByUser(studentId);
      const existingCourseIds = existingPurchases.map(purchase => purchase.courseId);

      // Filtrar los cursos que no están ya asignados
      const newCourseIds = courseIds.filter(courseId => !existingCourseIds.includes(courseId));

      // Crear nuevas compras para los cursos no asignados
      const newPurchases = newCourseIds.map(courseId => ({
        subscriptionId: null,
        estudianteId: studentId,
        courseId: courseId,
        fecha_adquisicion: currentDate,
        renovacion: renewalDate || null
      }));

      // Crear todas las compras en paralelo
      await Promise.all(newPurchases.map(purchase => courseBuyService.create(purchase)));

      // Enrolar al estudiante en los nuevos cursos
      await Promise.all(newCourseIds.map(courseId => userService.enrollInCourse(studentId, courseId)));

      // Actualizar las fechas de renovación de las compras existentes
      if (renewalDate) {
        await Promise.all(
          existingPurchases.map(purchase => 
            courseBuyService.update(purchase._id!, {
              renovacion: renewalDate
            })
          )
        );
      }
    } catch (error) {
      console.error("Error al asignar cursos:", error);
      throw error;
    }
  }

  /**
   * Asigna múltiples cursos a múltiples estudiantes
   * @param studentIds Array de IDs de estudiantes
   * @param courseIds Array de IDs de cursos
   * @param renewalDate ID opcional de la suscripción
   * @returns Promise<void>
   */
  static async assignMultipleCoursesToMultipleStudents(
    studentIds: string[],
    courseIds: string[],
    renewalDate?: string
  ): Promise<void> {
    try {
      // Crear un array de promesas para cada combinación estudiante-curso
      const assignmentPromises = studentIds.map(studentId =>
        this.assignMultipleCoursesToStudent(studentId, courseIds, renewalDate)
      );

      // Ejecutar todas las asignaciones en paralelo
      await Promise.all(assignmentPromises);
    } catch (error) {
      console.error('Error al asignar cursos a múltiples estudiantes:', error);
      throw error;
    }
  }
} 