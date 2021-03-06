/* _________________________________________________________________________
 *
 *             Tachyon : A Self-Hosted JavaScript Virtual Machine
 *
 *
 *  This file is part of the Tachyon JavaScript project. Tachyon is
 *  distributed at:
 *  http://github.com/Tachyon-Team/Tachyon
 *
 *
 *  Copyright (c) 2011, Universite de Montreal
 *  All rights reserved.
 *
 *  This software is licensed under the following license (Modified BSD
 *  License):
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are
 *  met:
 *    * Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *    * Neither the name of the Universite de Montreal nor the names of its
 *      contributors may be used to endorse or promote products derived
 *      from this software without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 *  IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 *  TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 *  PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL UNIVERSITE DE
 *  MONTREAL BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 *  PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 *  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 *  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 *  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * _________________________________________________________________________
 */

/**
Create a type analysis test
*/
function makeTypeTest(fileList, testName, validator)
{
    assert (
        typeof validator === 'function' ||
        validator === undefined,
        'invalid analysis validator function for: ' + fileList
    );

    if (typeof fileList === 'string')
        fileList = [fileList];

    if (testName === undefined)
    {
        testName = fileList[0];
        var slashIdx = testName.lastIndexOf('/');
        var periodIdx = testName.indexOf('.');
        testName = testName.substr(slashIdx + 1, periodIdx - slashIdx - 1);
    }

    var noStdLib = false;
    var runTypeProp = true;
    var runSPSTF = true;
    var runProgram = true;

    for (var i = 3; i < arguments.length; ++i)
    {
        var flag = arguments[i];

        switch (flag)
        {
            case 'nostdlib'     : noStdLib = true;      break;
            case 'notypeprop'   : runTypeProp = false;  break;
            case 'nospstf'      : runSPSTF = false;     break;
            case 'norun'        : runProgram = false;   break;

            default:
            error('unsupported flag: ' + flag);
        }
    }

    assert (
        tests.typeProp.hasOwnProperty(testName) === false,
        'test already exists: "' + testName + '"'
    );

    if (runTypeProp == true)
    {
        tests.typeProp[testName] = function ()
        {
            const params = config.hostParams;
            var analysis = new TypeProp(params);
            analysis.testOnFiles(fileList, {'nostdlib':noStdLib});
            if (validator)
                validator(testName, analysis);
        }
    }

    if (runSPSTF === true)
    {
        tests.spstf[testName] = function ()
        {
            const params = config.hostParams;
            var analysis = new SPSTF(params);
            analysis.testOnFiles(fileList, {'nostdlib':noStdLib});
            if (validator)
                validator(testName, analysis);
        }
    }

    if (runProgram === true)
    {
        tests.programs.type_analysis[testName] = genProgTest(fileList);
    }
}


function typeStatValidator(numUnreach)
{
    return function (testName, analysis)
    {
        var stats = analysis.compTypeStats();        

        var unreachStat = stats['num-fun-unreach'];

        if (unreachStat.cnt > numUnreach)
        {
            error(
                testName + ':\n' + 
                'found ' + unreachStat.cnt + ' unreachable functions, ' +
                'expected at most ' + numUnreach
            );
        }
    }
}

/**
Test suite for the TypeProp type analysis.
*/
tests.typeProp = tests.testSuite();

/**
Test suite for the SPSTF type analysis.
*/
tests.spstf = tests.testSuite();

//
// TODO: add ctor_modif, factory_modif
// Need to implement recency types first
//

makeTypeTest(
    'programs/type_analysis/global_add.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/string_simple.js', 
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/array_simple.js', 
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/call_simple.js', 
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/func_2ret.js', 
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/func_2calls.js', 
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/func_calls.js', 
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/global_def.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/arith_simple.js', 
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/cmp_simple.js', 
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/fib.js', 
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/loop_sum.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/obj_simple.js', 
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/obj_2paths.js', 
    undefined,
    undefined,
    'nostdlib',
    'norun'
);

makeTypeTest(
    'programs/type_analysis/obj_3paths.js', 
    undefined,
    undefined,
    'nostdlib',
    'norun'
);

makeTypeTest(
    'programs/type_analysis/obj_chain.js', 
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/get_undef.js', 
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/linked_list.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/cond_return.js', 
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/cond_prop.js', 
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/cond_global.js', 
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/cond_objs.js', 
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/cond_call.js', 
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/cond_pass2.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/cond_ret_obj.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/loop_obj.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/loop_obj2.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/loop_cond_obj.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/array_sum.js', 
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/obj_methods.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/obj_init.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/obj_init_junk.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/factory_2calls.js',
    undefined,
    undefined,
    'nostdlib',
    'notypeprop' // FIXME: TypeProp does strong updates wrong!
);

makeTypeTest(
    'programs/type_analysis/factory_2paths.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/factory_global.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/factory_cond.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/factory_inc.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/ctor_simple.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/ctor_array.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/ctor_strong.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/ctor_2calls.js',
    undefined,
    undefined,
    'nostdlib',
    'notypeprop' // FIXME: TypeProp does strong updates wrong!
);

makeTypeTest(
    'programs/type_analysis/proto_method.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/proto_chain.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/proto_clos.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/proto_loop.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/proto_cond.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/args_sum.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/args_max.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/clos_simple.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    [
        'programs/type_analysis/multi_file1.js',
        'programs/type_analysis/multi_file2.js'
    ],
    'multi_file',
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/stdlib_math.js'
);

makeTypeTest(
    'programs/type_analysis/stdlib_object.js'
);

makeTypeTest(
    'programs/type_analysis/stdlib_array.js'
);

makeTypeTest(
    'programs/type_analysis/stdlib_function.js'
);

makeTypeTest(
    'programs/type_analysis/stdlib_string.js'
);

makeTypeTest(
    'programs/type_analysis/stdlib_call.js',
    undefined,
    undefined,
    'notypeprop' // FIXME: no support for .call in TypeProp
);

makeTypeTest(
    'programs/type_analysis/stdlib_apply.js',
    undefined,
    undefined,
    'notypeprop' // FIXME: no support for .call in TypeProp
);

makeTypeTest(
    'programs/type_analysis/regress_arith.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/regress_cond.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/regress_btree.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/regress_btree2.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/regress_btree3.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/regress_btree4.js',
    undefined,
    undefined,
    'nostdlib',
    'norun'
);

makeTypeTest(
    'programs/type_analysis/regress_btree5.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/regress_crypto.js',
    undefined,
    undefined,
    'nostdlib'
);

makeTypeTest(
    'programs/type_analysis/regress_global.js'
);

makeTypeTest(
    'programs/type_analysis/regress_obj.js'
);

makeTypeTest(
    'programs/type_analysis/regress_base64.js'
);

makeTypeTest(
    'programs/type_analysis/regress_deltablue.js'
);

makeTypeTest(
    'programs/sunspider/bitops-3bit-bits-in-byte.js',
    undefined,
    typeStatValidator(0),
    'nostdlib',
    'norun'
);

makeTypeTest(
    'programs/sunspider/bitops-bitwise-and.js',
    undefined,
    typeStatValidator(0),
    'nostdlib',
    'norun'
);

makeTypeTest(
    'programs/sunspider/access-binary-trees.js',
    undefined,
    typeStatValidator(0),
    'notypeprop',
    'norun'
);

makeTypeTest(
    'programs/sunspider/access-fannkuch.js',
    undefined,
    typeStatValidator(0),
    'notypeprop',
    'norun'
);

makeTypeTest(
    'programs/sunspider/access-nbody.js',
    undefined,
    typeStatValidator(1),
    'notypeprop',
    'norun'
);

makeTypeTest(
    'programs/sunspider/access-nsieve.js',
    undefined,
    typeStatValidator(1),
    'notypeprop',
    'norun'
);

makeTypeTest(
    'programs/sunspider/bitops-bits-in-byte.js',
    undefined,
    typeStatValidator(0),
    'nostdlib',
    'notypeprop',
    'norun'
);

makeTypeTest(
    'programs/sunspider/bitops-nsieve-bits.js',
    undefined,
    typeStatValidator(1),
    'notypeprop',
    'norun'
);

makeTypeTest(
    'programs/sunspider/3d-morph.js',
    undefined,
    typeStatValidator(0),
    'norun'
);

makeTypeTest(
    'programs/sunspider/3d-cube.js',
    undefined,
    typeStatValidator(1),
    'notypeprop',
    'norun'
);

makeTypeTest(
    'programs/sunspider/3d-raytrace.js',
    undefined,
    typeStatValidator(1),
    'notypeprop',
    'norun'
);

makeTypeTest(
    'programs/sunspider/crypto-sha1.js',
    undefined,
    typeStatValidator(9),
    'notypeprop',
    'norun'
);

makeTypeTest(
    'programs/sunspider/crypto-md5.js',
    undefined,
    typeStatValidator(9),
    'notypeprop',
    'norun'
);

makeTypeTest(
    'programs/sunspider/crypto-aes.js',
    undefined,
    typeStatValidator(11),
    'notypeprop',
    'norun'
);

makeTypeTest(
    'programs/sunspider/math-cordic.js',
    undefined,
    typeStatValidator(2),
    'notypeprop',
    'norun'
);

makeTypeTest(
    'programs/sunspider/math-partial-sums.js',
    undefined,
    typeStatValidator(0),
    'notypeprop',
    'norun'
);

makeTypeTest(
    'programs/sunspider/math-spectral-norm.js',
    undefined,
    typeStatValidator(0),
    'notypeprop',
    'norun'
);

makeTypeTest(
    'programs/sunspider/string-base64.js',
    undefined,
    typeStatValidator(0),
    'notypeprop',
    'norun'
);

makeTypeTest(
    [
        'programs/v8bench/navier-stokes.js',
        'programs/v8bench/drv-navier-stokes.js'
    ],
    undefined,
    typeStatValidator(7),
    'notypeprop',
    'norun'
);

makeTypeTest(
    [
        'programs/v8bench/richards.js',
        'programs/v8bench/drv-richards.js'
    ],
    undefined,
    typeStatValidator(6),
    'notypeprop',
    'norun'
);

makeTypeTest(
    [
        'programs/v8bench/splay.js',
        'programs/v8bench/drv-splay.js'
    ],
    undefined,
    typeStatValidator(0),
    'notypeprop',
    'norun'
);

makeTypeTest(
    [
        'programs/v8bench/deltablue.js',
        'programs/v8bench/drv-deltablue.js'
    ],
    undefined,
    typeStatValidator(1),
    'notypeprop',
    'norun'
);

// TODO: v8bench/crypto, currently very slow

