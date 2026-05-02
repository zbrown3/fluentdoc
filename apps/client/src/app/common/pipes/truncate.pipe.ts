import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true // This allows the pipe to be used in standalone components
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 200, trail: string = '...'): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}