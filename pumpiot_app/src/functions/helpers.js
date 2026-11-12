/**
 * Convert to inr
 * @param x (float)
 */
export const formatInr = (x) => {
    x = x.toString();
    var afterPoint = '';
    if (x.indexOf('.') > 0)
        afterPoint = x.substring(x.indexOf('.'), x.length);
    x = Math.floor(x);
    x = x.toString();
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers != '')
        lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;

};

export const groupBy = (array, key) => {
    return array.reduce(
        (r, v, _, __, k = v[key]) => ((r[k] || (r[k] = [])).push(v), r),
        {}
    );
};

export const sum = (arr, key) => {
    if(!arr) return null;
    return arr.reduce((a, b) => a + (b[key] || 0), 0);
};

export const floor = (num) => {
    return Math.floor(num * 100) / 100
};

export const pdfPageNumber = () => {

}