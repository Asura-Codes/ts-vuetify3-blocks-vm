'use strict';


const zero = (n: number | string, max: number) => {
  n = n.toString(16).toUpperCase();
  while (n.length < max) {
    n = '0' + n;
  }
  return n;
};

const hex = (buffer: Uint8Array) => {
  var rows = Math.ceil(buffer.length / 16);
  var last = buffer.length % 16 || 16;
  var offsetLength = buffer.length.toString(16).length;
  if (offsetLength < 6) offsetLength = 6;

  var str = 'Offset';
  while (str.length < offsetLength) {
    str += '&nbsp;';
  }

  str = '<span style="color:DodgerBlue;">' + str + '</span>&nbsp;&nbsp;';

  var i;
  for (i = 0; i < 16; i++) {
    str += '&nbsp;' + zero(i, 2);
  }

  str += '\n';
  if (buffer.length) str += '\n';

  var b = 0;
  var lastBytes;
  var lastSpaces;
  var v;

  for (i = 0; i < rows; i++) {
    str += '<span style="color:DodgerBlue;">' + zero(b, offsetLength) + '</span>&nbsp;&nbsp;';
    lastBytes = i === rows - 1 ? last : 16;
    lastSpaces = 16 - lastBytes;

    var j;
    for (j = 0; j < lastBytes; j++) {
      str += '&nbsp;' + zero(buffer[b], 2);
      b++;
    }

    for (j = 0; j < lastSpaces; j++) {
      str += '&nbsp;&nbsp;&nbsp;';
    }

    b -= lastBytes;
    str += '&nbsp;&nbsp;&nbsp;<span style="color:MediumSeaGreen;">';

    for (j = 0; j < lastBytes; j++) {
      v = buffer[b];
      str += (v > 31 && v < 127) || v > 159 ? String.fromCharCode(v) : '.';
      b++;
    }

    str += '</span>\n';
  }
  str += '\n';

//   process.stdout.write(str);
  return str;
};

export default hex;