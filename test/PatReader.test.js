
var test        = require( 'tape' );
var PatReader   = require( '../PatReader' );
var fs          = require( 'fs' );

test( 'quick test', function( t ){

    // http://www.adobe.com/devnet-apps/photoshop/fileformatashtml/
    // http://www.selapa.net/swatches/patterns/fileformats.php
    // http://registry.gimp.org/files/ps-pat-load_1.c

    var file = 'fixtures/ali_basic_patterns.pat';

    fs.open( file, 'r', function(error, fd) {

        console.log( 'status : ', error  );
        if (error) {
            t.fail( error.message );
            return;
        }

        var bufferLen = 1000;
        var buffer = new Buffer(bufferLen);

        var spec = [
            'filesig', 4,
            'version', 2,
            'pattern_count', 4
        ];

        var idx = 0;
        var step = 2;

        while( idx<spec.length ){
            idx+=step;
        }

        fs.read(fd, buffer, 0, bufferLen, 0, function(err, bytesRead, buffer) {

            var offset = 0;

            var filesig = buffer.toString('utf8',offset,4);
            offset+=4;
            var version = buffer.readUInt16BE(offset);
            offset+=2;
            var numPatterns = buffer.readUInt32BE(offset);
            offset+=4;

            console.log( 'filesig:', filesig );
            console.log( 'version:', version );
            console.log( 'numPatterns:', numPatterns );

            var colorModels = {
                1: 'Grayscale',
                2: 'Indexed',
                3: 'RGB',
                4: 'CMYK',
                5: 'HSL',
                7: 'Multichannel',
                9: 'Lab'
            };

            var patternIdx = 0;

            while( patternIdx < numPatterns ){

                console.log( patternIdx );
                patternIdx++;

                var pVersion = buffer.readUInt32BE(offset);
                offset+=4;
                var colorModel = buffer.readUInt32BE(offset);
                offset+=4;
                var width = buffer.readUInt16BE(offset);
                offset+=2;
                var height = buffer.readUInt16BE(offset);
                offset+=2;
                var nameLen = ( buffer.readInt32BE(offset) * 2 );
                offset+=4;
                var name = buffer.toString( 'utf8', offset, offset + nameLen );
                offset+=nameLen;
                var idLen = buffer.readUInt8(offset);
                offset += 1;
                var id = buffer.toString( 'utf8', offset, offset + idLen );
                offset+=idLen;
                if( colorModel === 2 ){ // indexed.
                    throw new Error( 'Possibly needs extra handling for Indexed Color patterns.')
                }

                var ver = buffer.readUInt32BE(offset);
                offset+=4;
                var pattSize = buffer.readUInt32BE(offset);
                offset+=4;

                // TODO : as to the side order is probably l,t,r,b
                var top = buffer.readUInt32BE(offset);
                offset+=4;
                var left = buffer.readUInt32BE(offset);
                offset+=4;
                var bottom = buffer.readUInt32BE(offset); // TODO - CHECK RIGHT / BOTTOM IS WRONG???
                offset+=4;
                var right = buffer.readUInt32BE(offset);
                offset+=4;



                console.log( 'pVersion:', pVersion );
                console.log( 'colorMode:', colorModel, colorModels[colorModel] );
                console.log( 'width:', width );
                console.log( 'height:', height );
                console.log( 'name:', name );
                console.log( 'id:', id );
                console.log( 'ver2:', ver );
                console.log( 'pattSize:', pattSize );
                console.log( 'top:', top );
                console.log( 'left:', left );
                console.log( 'bottom:', bottom );
                console.log( 'right:', right );


                // Channels.

                var numChannels = buffer.readUInt32BE(offset);
                offset+=4;

                var bool = buffer.readUInt32BE(offset);
                offset+=4;
                var channelSize = buffer.readUInt32BE(offset);
                offset+=4;
                var depth = buffer.readUInt32BE(offset);
                offset+=4;

                var ctop = buffer.readUInt32BE(offset);
                offset+=4;
                var cleft = buffer.readUInt32BE(offset);
                offset+=4;
                var cbottom = buffer.readUInt32BE(offset); // TODO - CHECK RIGHT / BOTTOM IS WRONG???
                offset+=4;
                var cright = buffer.readUInt32BE(offset);
                offset+=4;

                var depth2 = buffer.readUInt16BE(offset);
                offset+=2;

                // (0: data is uncompressed, 1: RLE (PackBits) compression, 2: ZIP without prediction, 3: ZIP with prediction)
                // — however, I've only seen 0 and 1
                var compression = buffer.readUInt8(offset);
                offset += 1;


                console.log( 'numChannels:', numChannels );

                console.log( 'bool:', bool );
                console.log( 'channelSize:', channelSize );
                console.log( 'depth:', depth );

                console.log( 'ctop:', ctop );
                console.log( 'cleft:', cleft );
                console.log( 'cbottom:', cbottom );
                console.log( 'cright:', cright );

                console.log( 'depth2:', depth2 );

                console.log( 'compression:', compression );

                console.log( 'TEST' +  buffer.toString( 'utf8', offset, offset + 1000 ) );







                // SKIP TEST...
                patternIdx = numPatterns;
            }

        });

        t.end();
    });

});
