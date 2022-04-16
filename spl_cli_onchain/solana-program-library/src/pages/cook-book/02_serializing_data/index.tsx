import { HeaderElement } from "_comps";
import { conn } from "_consts";
import LinkNavs from "_consts/link_nav_cook_book";

const SerializeData = () => {
    return <section>{HeaderElement(LinkNavs._2.title)}</section>;
};

export default SerializeData;
