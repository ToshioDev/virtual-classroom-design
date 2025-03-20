export interface Live {
  _id?: string;
  name: string;  // Add this new field
  thumbnail: string;
  url_video: string;
  isZoomLive: boolean;
  descripcion: string;
  createdAt?: Date;
  updatedAt?: Date;
}
