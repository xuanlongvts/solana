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
        display: flex;
        height: 100vh;
    }
    aside {
        background: linear-gradient(253deg, #00ffa3, #dc1fff);
        max-width: 450px;
        min-width: 350px;
        padding: 15px 0;
        height: 100%;
        width: 30%;
        overflow: auto;
    }

    main {
        width: 100%;
    }

    header {
        height: 57px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 15px;
        padding-left: 5px;
        /* border-bottom: 1px solid; */
    }

    section {
        padding: 15px;
        display: flex;
        flex-direction: column;
        height: calc(100% - 57px);
        justify-content: space-between;
    }

    kbd {
        font: 11px Consolas, Liberation Mono, Menlo, monospace;
        color: #444d56;
        border: 1px solid #d1d5da;
        padding: 5px;
        box-shadow: inset 0 -1px 0 #d1d5da;
        line-height: 10px;
        border-radius: 3px;
        vertical-align: middle;
        background-color: #fafbfc;
    }

    code {
        display: inline-block;
        padding: 5px;
        direction: ltr;
        font-size: 0.85em;
        font-family: Consolas, 'Liberation Mono', Menlo, Courier, monospace;
        line-height: 1.4;
        border-radius: 2px;
        background-color: rgba(0, 0, 0, 0.5);
        color: #fff;
    }
`;
