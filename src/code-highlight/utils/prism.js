/**
 * Prism and the grammars, in one module so the editor and the frontend load the
 * same set. Registration order matters: a grammar that builds on another throws
 * at load if its base is missing, and that would abort this whole module.
 */
import Prism from 'prismjs/components/prism-core';

import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-dart';
import 'prismjs/components/prism-diff';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-haskell';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-julia';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-less';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-perl';
// PHP's grammar is built on the templating helper, and requiring it later throws.
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-yaml';

/**
 * An unregistered grammar leaves the text as plain, readable code rather than
 * throwing and blanking the block.
 */
export const tokenise = (element, language) => {
	if (!element || !language || 'none' === language || !Prism.languages[language]) return;

	Prism.highlightElement(element);
};

export default Prism;
