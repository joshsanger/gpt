import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import resetCss from '~/stylesheets/reset.css';
import mainCss from '~/stylesheets/main.css';

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function links() {
  return [
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,500;0,700;1,400&display=swap",
    },
    {
      rel: "stylesheet",
      href: resetCss,
    },
    {
      rel: "stylesheet",
      href: mainCss,
    }
  ];
}
