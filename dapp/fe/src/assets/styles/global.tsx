import css from 'styled-jsx/css';

export default css.global`
    *,
    ::after,
    ::before {
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    html,
    body,
    #__next {
        height: 100%;
    }

    html {
        &.overflow {
            overflow: hidden;
        }
    }

    body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Open Sans', sans-serif;
        font-size: 0.875rem;
        font-weight: 400;
        line-height: 1.5;
        color: var(--ink500);
        text-align: left;

        /* user-select: none; */
    }

    #__next {
        padding-top: 56px;
    }
`;
