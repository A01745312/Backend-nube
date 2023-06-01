declare module 'stream-to-array' {
    import { Stream } from 'stream';
  
    function streamToArray(stream: Stream): Promise<any[]>;
  
    export = streamToArray;
  }
  