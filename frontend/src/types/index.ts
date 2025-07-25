export interface Song{
 _id : string;
 title : string;
 artist : string;
 imageUrl : string;
 audioUrl : string;
 duration : number;
 albumId : string | null;
 createdAt : string;
 updatedAt : string;
}

export interface Album{
 _id : string;
 title : string;
 artist : string;
 imageUrl : string;
 songs : Song[];
 releaseYear : number;

}

export interface Stats {
 totalSongs : number;
 totalAlbums : number;
 totalUsers : number  ;
 totalArtists : number
} 


export interface Message{
  _id : string;
  senderid  : string;
  receiverId : string;
  content : string;
  createdAt : string;
  updatedAt : string;
}

export interface User {
  _id:string;
  clerkId : string;
  fullName : string;
  imageUrl : string;
}