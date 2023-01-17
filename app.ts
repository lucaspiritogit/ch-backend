import { Application, Router } from 'https://deno.land/x/oak@v7.3.0/mod.ts';

const colors: string[] = [];
const app = new Application();
const port = 8000;

const router = new Router();

router.post('/color', async context => {
  const body = context.request.body({ type: 'form' });
  const value = await body.value;
  let color = value.get('color');
  if (!color) {
    color = 'white';
  }
  colors.push(color);
  console.log('🚀 ~ file: app.ts:4 ~ colors', colors);
  context.response.redirect('/');
});
router.get('/', context => {
  context.response.body = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Coderhouse | backend</title>
 </head>
	<body style="background-color:black;">
	    <div id="root"> 
            <form action="/color" method="post">
                <input type="text" name="color" />
                <button type="submit">Add color</button>
            </form>
            <br />
            <h1 style="color: white">Colors</h1>
            ${colors
              .map(
                color =>
                  `<div style="background-color: ${color}; width: 100px; height: 100px;"></div>`
              )
              .join('<br>')};
        </div>
   </body>
 </html>`;
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port });
console.log(`Server up at http://localhost:${port}`);
