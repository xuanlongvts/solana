export enum names {
    title = 'title',
    des = 'description',
    imgLink = 'image_link',
}

export type T_InforCampaiin = {
    [names.title]?: string | null;
    [names.des]?: string | null;
    [names.imgLink]?: string | null;
};
