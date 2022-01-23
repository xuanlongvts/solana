import * as Yup from 'yup';

import { names } from './consts';

const titleRules = {
    min: 3,
    max: 100,
};
export const fielditle = Yup.string()
    .min(titleRules.min, `Title min ${titleRules.min} characters`)
    .max(titleRules.max, `Title max ${titleRules.max} characters`)
    .required('Title required');

const desRules = {
    min: 3,
    max: 500,
};
export const fieldDes = Yup.string()
    .min(desRules.min, `Description min ${desRules.min}`)
    .max(desRules.max, `Description max ${desRules.max}`)
    .required('Description required');

const imgLink = {
    min: 5,
    max: 500,
};
export const fieldImgLink = Yup.string()
    .min(imgLink.min, `Image link min ${imgLink.min}`)
    .max(imgLink.max, `Image link max ${imgLink.max}`)
    .required('Image link required');

export const CampainSchema = Yup.object().shape({
    [names.title]: fielditle,
    [names.des]: fieldDes,
    [names.imgLink]: fieldImgLink,
});
