import { Group, Object3DEventMap } from "three";

export interface Album {
    id: string;
    title: string;
    artist: string;
    list: string[];
    cover: string;
    url: string;
}

export interface FocusedAlbum extends Album {
    lpObject: Group<Object3DEventMap> | null;
}
