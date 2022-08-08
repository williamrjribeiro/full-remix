# William's Notes

## Official stacks have bad support for JavaScript
I created a Remix project with `npx create-remix --template remix-run/grunge-stack` to enable serverless deployments and opted to use JavaScript. Everything installs fine but there are many errors: linting, Cypress E2E and Vitest. There's a [Draft PR open](https://github.com/remix-run/grunge-stack/pull/50) for it since April to address issues but it a bit stalled. The TypeScript version works perfectply.

## SSR with MUI is complicated
Remix preffers CSS only frameworks as it's better for performance loading small chunks of CSS as needed. Since MUI 5 uses Emotion which is a CSS-in-JS, it does not integrate easily with Remix. Theres a lot of [pumbling code](https://github.com/mui/material-ui/tree/master/examples/remix-with-typescript) to make SSR work. Can MUI 5 work without CSS SSR?

## SSR is complicated
Server Side Rendering has many benefits for UX as it really boosts performance of the application running on the user's browser. The biggest drawback is the code complexity that increases an order of magnitude. Where should this code live, client or server? Is this library compatible with SSR? How do I test and debug this SSR component? For instance, i18n is doable but the [code is much more tricky](https://github.com/sergiodxa/remix-i18next#readme) since the i18n tools must be configured and initialized for front and back ends.

## It's just "too new"
One of the most common problem of new stuff: general compatibility with other tools and systems. Not many important integrations, not much StackOverflow entries, not many relevant blog posts with complex or niche scenarios and so on.
I do believe that considering who's behind Remix, the hype, and the overall quality of the framework, this problem won't take too long to be minimized.