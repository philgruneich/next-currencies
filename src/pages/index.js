import React from 'react';
import fetch from 'node-fetch';
import Head from 'next/head';

const endpoint = 'https://api.exchangeratesapi.io/latest';

function formatMoneyNumber(value, currency) {
  return value.toLocaleString(undefined, {
    style: 'currency',
    currency
  });
}

function Page({ data, params }) {
  const output = formatMoneyNumber(data.rates[params.symbols] * params.value, params.symbols);

  return (
    <>
    <Head>
      <title>Converting {params.value} {params.base} to {params.symbols}</title>
    </Head>
    <div className="currencies-converter">
      <div className="wrapper">
        <h1>Currencies</h1>
        <p className="caption">
          {params.value}&nbsp;{params.base} → {params.symbols}
        </p>
        <p id="output">{output}</p>
      </div>
      <footer>Currency data from <a href="https://exchangeratesapi.io/">https://exchangeratesapi.io/</a></footer>
    </div>
    <style jsx global>{`
      * {
        box-sizing: border-box;
      }

      body {
        color: #fff;
        height: 100%;
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
        font-size: 20px;
        line-height: 24px;
      }

      body,
      html {
        margin: 0;
        background: #333;
        overflow: hidden;
        font-weight: normal;
      }

      .currencies-converter {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        padding: 1em;
        text-align: center;
      }

      #output {
        margin: 0;
        font-size: 2.4em;
        line-height: 1;
        color: #fff;
        text-shadow: 0 -3px 0 #000;
        text-transform: uppercase;
        font-weight: 700;
      }

      h1 {
        margin: 0 auto;
        font-size: .8em;
        line-height: 1;
        text-transform: uppercase;
      }

      .caption {
        margin: 0;
        font-size: .6em;
      }

      footer {
        margin-top: auto;
        font-size: .6em;
        color: #7e7e7e;
      }

      a {
        color: inherit;
      }

      .wrapper {
        max-height: 500px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    
    `}</style>
    </>
  )
}
  
// This gets called on every request
export async function getServerSideProps({ query }) {
  const params = {
      base: query.from || 'USD',
      symbols: query.to || 'BRL',
      value: query.value || 1
  };

  const searchParams = new URLSearchParams(params);

  const searchParamsString = searchParams.toString();

  const res = await fetch(`${endpoint}?${searchParamsString}`);
  const data = await res.json();

  // Pass data to the page via props
  return { props: { data, params } }
}

export default Page