import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';
import CleanCSS from 'clean-css';

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="vi">
                <Head>
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

MyDocument.getInitialProps = async ctx => {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: App => props => sheets.collect(<App {...props} />),
        });

    const initialProps = await Document.getInitialProps(ctx);

    return {
        ...initialProps,

        styles: (
            <>
                {initialProps.styles}
                <style
                    id="jss-server-side"
                    key="jss-server-side"
                    dangerouslySetInnerHTML={{ __html: new CleanCSS({}).minify(sheets.toString()).styles }}
                />
            </>
        ),
    };
};
