export type WithoutId<T> = Omit<T, 'id'>;

export type WithoutTimestamps<T> = Omit<T, 'createdAt' | 'updatedAt'>;

export type WithoutMeta<T> = Omit<T, 'createdAt' | 'updatedAt' | 'id'>;

export type DbError = { message: string };

export type DbResult<T> = [DbError, null] | [null, T];

export type DbPaginatedResult<T> =
    | [DbError, null]
    | [null, { data: T[]; totalRecordCount: number }];

export type DbOrderBy<T> = [keyof T, 'asc' | 'desc'][];

// export type DBRelatedImage = {
//     imageId: string;
//     imageType: ImageType;
//     remoteId: string;
// };

// export type DBRelatedAlbumArtist = {
//     albumArtistId: string;
//     name: string;
//     remoteId: string;
// };

// export type DBRelatedGenre = {
//     genreId: string;
//     name: string;
//     remoteId: string;
//     serverId: string;
// };

// export type DBRelatedServer = {
//     name: string;
//     remoteId: string;
//     serverId: string;
// };

// export type DBLibrary = InferSelectModel<typeof libraries>;
// export type InsertDBLibrary = InferInsertModel<typeof libraries>;
// export type UpdateDBLibrary = Partial<InsertDBLibrary>;

// export type DBLibraryUrl = InferSelectModel<typeof libraryUrl>;
// export type InsertDBLibraryUrl = InferInsertModel<typeof libraryUrl>;
// export type UpdateDBLibraryUrl = Partial<InsertDBLibraryUrl>;
// export type IncludeLibrary<T> = T & { library: DBLibrary };
// export type PartialIncludeLibrary<T> = T & { library: DBLibrary | null };

// export type DbUser = InferSelectModel<typeof users>;
// export type InsertDBUser = InferInsertModel<typeof users>;
// export type UpdateDBUser = Partial<InsertDBUser>;

// export type DBJob = InferSelectModel<typeof job>;
// export type InsertDBJob = InferInsertModel<typeof job>;
// export type UpdateDBJob = Partial<InsertDBJob>;

// export type DBRefreshToken = InferSelectModel<typeof refreshToken>;
// export type InsertDBRefreshToken = InferInsertModel<typeof refreshToken>;
// export type UpdateDBRefreshToken = Partial<InsertDBRefreshToken>;

// export type DBGenre = InferSelectModel<typeof genre>;
// export type InsertDBGenre = InferInsertModel<typeof genre>;
// export type UpdateDBGenre = Partial<InsertDBGenre>;

// export type DBAlbumArtist = InferSelectModel<typeof albumArtist>;
// export type InsertDBAlbumArtist = InferInsertModel<typeof albumArtist>;
// export type UpdateDBAlbumArtist = Partial<InsertDBAlbumArtist>;

// export type DBAlbum = InferSelectModel<typeof album>;
// export type InsertDBAlbum = InferInsertModel<typeof album>;
// export type UpdateDBAlbum = Partial<InsertDBAlbum>;

// export type DBMediaFile = InferSelectModel<typeof mediaFile>;
// export type InsertDBMediaFile = InferInsertModel<typeof mediaFile>;
// export type UpdateDBMediaFile = Partial<InsertDBMediaFile>;
