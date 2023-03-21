type ErrorType = {
  message?: string;
  response?: any;
  method?: string;
  resourceUrl?: string;
  bodyText?: string;
};

class RestAPIError extends Error {
  public message: string;
  public response: any;
  public method: string;
  public resourceUrl: string;
  public bodyText: { [key: string]: unknown };

  constructor({ method, resourceUrl, response, bodyText }: ErrorType) {
    let body = '';
    let parsedBodyText;

    try {
      parsedBodyText = JSON.parse(bodyText ?? '');
      const { message, ...rest } = parsedBodyText;

      if (message) {
        body += `Message:\n\n  ${message}\n`;
      }

      const addl = Object.entries(rest);
      if (addl.length > 0) {
        body += `\nAdditional info:\n\n${JSON.stringify(rest, null, 4)}\n\n`;
      }

      body += '\n';
    } catch (e) {
      body = bodyText ?? '';
    }

    super(
      `${method} ${resourceUrl} responded ${response.status} ${response.statusText}: \n\n${body}`
    );

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RestAPIError);
    }

    this.response = response;
    this.method = method ?? '';
    this.resourceUrl = resourceUrl ?? '';
    this.bodyText = parsedBodyText;
    this.message = parsedBodyText?.message;
  }
}

export default RestAPIError;
