export interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  audioUrl: string;
  uploadDate: string;
  playCount: number;
}

export interface Playlist {
  id: string;
  name: string;
  creator: string;
  trackCount: number;
  mood: string;
  createdDate: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  bio: string;
  favoriteGenre: string;
  joinedDate: string;
}

export interface ApiTrack {
  id: string;
  fieldValues: {
    '/text': string;
    '/attributes/@trk01': string;
    '/attributes/@art01': string;
    '/attributes/@gen01': string;
    '/attributes/@dur01': string;
    '/attributes/@url01': string;
    '/attributes/@upl01': string;
    '/attributes/@pla01': number;
  };
}

export interface ApiPlaylist {
  id: string;
  fieldValues: {
    '/text': string;
    '/attributes/@pln01': string;
    '/attributes/@crt01': string;
    '/attributes/@trks': number;
    '/attributes/@mod01': string;
    '/attributes/@crd01': string;
  };
}
