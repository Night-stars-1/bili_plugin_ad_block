/*
 *Author: Night-stars-1 nujj1042633805@gmail.com
 *Date: 2024-11-08 23:42:20
 *LastEditors: Night-stars-1 nujj1042633805@gmail.com
 *LastEditTime: 2024-11-09 00:30:47
 */

regFetchAfter("x/web-interface/wbi/index/top/feed/rcmd", async (response) => {
  const data = await response.json();
  data.data.item = data.data.item.filter((item) => item.goto != "ad");
  return data;
});
