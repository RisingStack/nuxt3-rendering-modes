export default defineEventHandler((event) => {
  return new Date().toUTCString();
});
