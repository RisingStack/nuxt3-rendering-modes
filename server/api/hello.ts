export default defineEventHandler((event) => {
  console.log("HERE");
  return {
    hello: "world" + new Date().toUTCString(),
  };
});
