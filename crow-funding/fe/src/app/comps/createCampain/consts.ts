export enum names {
    title = 'title',
    des = 'description',
    imgLink = 'image_link',
}

export type T_InforCampaiin = {
    [names.title]?: string;
    [names.des]?: string;
    [names.imgLink]?: string;
};
