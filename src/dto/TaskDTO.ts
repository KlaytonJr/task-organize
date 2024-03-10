export enum StatusEnum {
    OPEN = 'OPEN',
    FINISHED = 'FINISHED'
}

export interface TaskDTO {
  creation?: Date;
  _id?: string;
  description: string;
  status: StatusEnum | string;
  responsible?: {
    creation?: Date;
    _id?: string
    name?: string
    email?: string
    __v?: number
  }
  __v?: number
}
