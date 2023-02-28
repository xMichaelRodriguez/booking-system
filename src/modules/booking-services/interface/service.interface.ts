export interface IServiceIg {
  data: IService[];
  paging: IServicePaging;
}

export interface IServicePaging {
  cursors: ICursors;
  next: string;
  prev: string;
}

interface ICursors {
  before: string;
  after: string;
}

export interface IService {
  id: number;
  caption: string;
  media_url: string;
  thumbnail_url?: string;
}

export interface IServiceParsed {
  igPostId: number;
  caption: string;
  mediaUrl: string;
}
