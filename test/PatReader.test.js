
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

        var buffer = new Buffer(100);

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

        fs.read(fd, buffer, 0, 100, 0, function(err, bytesRead, buffer) {

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
                var name = buffer.toString( 'utf8', offset, 100 );


                console.log( 'pVersion:', pVersion );
                console.log( 'colorMode:', colorModel, colorModels[colorModel] );
                console.log( 'width:', width );
                console.log( 'height:', height );
                console.log( 'name:', name );

                // SKIP TEST...
                patternIdx = numPatterns;
            }

        });

        t.end();
    });

});
