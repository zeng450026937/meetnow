const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
// btoa
function btoa(input: string) {
  const str = String(input);
  // initialize result and counter
  let block: number | undefined;
  let charCode: number | undefined;
  let idx = 0;
  let map = chars;
  let output = '';
  /* eslint-disable no-cond-assign, no-bitwise, no-mixed-operators */
  for (
    ;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new Error('"btoa" failed: The string to be encoded contains characters outside of the Latin1 range.');
    }
    block = block! << 8 | charCode;
  }
  return output;
}

export default btoa;
