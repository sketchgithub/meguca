{
  "targets": [
    {
      "target_name": "compare",
      "include_dirs" : [
        "<!(node -e \"require('nan')\")"
      ],
      "sources": [ "src/compare.cpp"]
    },
    {
      "target_name": "findapng",
      "include_dirs" : [
        "<!(node -e \"require('nan')\")"
      ],
      "sources": [ "src/findapng.cpp","src/apngDetector.cpp"],
	  'conditions': [
			['OS=="win"',{
				'defines': ['uint=unsigned int']
			}]
		]
    },
    {
      "target_name": "mnemonics",
      "include_dirs" : [
        "<!(node -e \"require('nan')\")"
      ],
      "sources": ["src/mnemonics.cpp","src/mnemonizer.cpp"],
      'conditions': [
        [ 'OS=="win"', {
		  'libraries': [
			'<(module_root_dir)/src/deps/openssl/libeay32.lib'
		  ]
        }, { # OS!="win"
          'include_dirs': [
            # use node's bundled openssl headers on Unix platforms
            '<(node_root_dir)/deps/openssl/openssl/include'
          ],
        }],
      ]
    },
    {
      "target_name": "tripcode",
      "include_dirs" : [
       "<!(node -e \"require('nan')\")"
      ],
      "sources": ["src/tripcode.cc"],
	  "conditions": [
		['OS=="win"',{
			'dependencies': ['node_modules/iconv/binding.gyp:libiconv'],
			'libraries': [ '<(module_root_dir)/src/deps/openssl/libeay32.lib']
		}, { # OS!="win"
			    'include_dirs': [
					# use node's bundled openssl headers on Unix platforms
					'<(node_root_dir)/deps/openssl/openssl/include'
			    ]
        }]
      ]
    }]
}
