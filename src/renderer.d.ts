/**
 * 监听fetch请求前
 * @param url 监听的Url
 * @param handler 
 * @returns 返回options替换请求，返回null拦截请求
 */
async function regFetchBefore(
  url: string,
  handler: (url: string, options: RequestInit) => Promise<RequestInit?>
): Promise<void>;

/**
 * 监听fetch请求后
 * @param url 监听的Url
 * @param handler 
 * @returns 返回body替换请求，返回null拦截请求
 */
async function regFetchAfter(
  url: string,
  handler: (response: Response) => Promise<any>
): Promise<void>;
