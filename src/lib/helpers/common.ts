/**
 * Truncate text
 *
 * @kind function
 *
 * @param {string} text to truncate
 * @param {int} limit of text to truncate
 * @param {string} replaceText
 *
 * @return string
 */
export const truncateText = (
  text: string,
  limit: number = 52,
  replaceText: string = '...'
): string => {
  return text.length > limit - replaceText.length
    ? text.substr(0, limit).trim().concat(replaceText)
    : text;
};
