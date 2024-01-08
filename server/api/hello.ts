export default defineEventHandler((event) => {
  return {
    hello: "world" + new Date().toUTCString(),
  };
});
