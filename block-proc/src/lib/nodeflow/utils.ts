/**
 * 
 * @param start_pos_x 
 * @param start_pos_y 
 * @param end_pos_x 
 * @param end_pos_y 
 * @param curvature_value 
 * @param type 
 * @returns 
 */

export function createCurvature(start_pos_x: number, start_pos_y: number, end_pos_x: number, end_pos_y: number, curvature_value: number, type: string) {
    const line_x = start_pos_x;
    const line_y = start_pos_y;
    const x = end_pos_x;
    const y = end_pos_y;
    const curvature = curvature_value;
    //type openclose open close other
    switch (type) {
        case 'open':
            if (start_pos_x >= end_pos_x) {
                var hx1 = line_x + Math.abs(x - line_x) * curvature;
                var hx2 = x - Math.abs(x - line_x) * (curvature * -1);
            } else {
                var hx1 = line_x + Math.abs(x - line_x) * curvature;
                var hx2 = x - Math.abs(x - line_x) * curvature;
            }
            return ' M ' + line_x + ' ' + line_y + ' C ' + hx1 + ' ' + line_y + ' ' + hx2 + ' ' + y + ' ' + x + '  ' + y;

            break
        case 'close':
            if (start_pos_x >= end_pos_x) {
                var hx1 = line_x + Math.abs(x - line_x) * (curvature * -1);
                var hx2 = x - Math.abs(x - line_x) * curvature;
            } else {
                var hx1 = line_x + Math.abs(x - line_x) * curvature;
                var hx2 = x - Math.abs(x - line_x) * curvature;
            }
            return ' M ' + line_x + ' ' + line_y + ' C ' + hx1 + ' ' + line_y + ' ' + hx2 + ' ' + y + ' ' + x + '  ' + y;
            break;
        case 'other':
            if (start_pos_x >= end_pos_x) {
                var hx1 = line_x + Math.abs(x - line_x) * (curvature * -1);
                var hx2 = x - Math.abs(x - line_x) * (curvature * -1);
            } else {
                var hx1 = line_x + Math.abs(x - line_x) * curvature;
                var hx2 = x - Math.abs(x - line_x) * curvature;
            }
            return ' M ' + line_x + ' ' + line_y + ' C ' + hx1 + ' ' + line_y + ' ' + hx2 + ' ' + y + ' ' + x + '  ' + y;
            break;
        default:

            var hx1 = line_x + Math.abs(x - line_x) * curvature;
            var hx2 = x - Math.abs(x - line_x) * curvature;

            return ' M ' + line_x + ' ' + line_y + ' C ' + hx1 + ' ' + line_y + ' ' + hx2 + ' ' + y + ' ' + x + '  ' + y;
    }
}