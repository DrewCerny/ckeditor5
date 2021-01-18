/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module image/image/imageinline
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { toImageWidget, createImageViewElement, getImageTypeMatcher } from './utils';
import { addUpcastImageConverters, modelToViewAttributeConverter, srcsetAttributeConverter } from './converters';

/**
 * The image engine plugin.
 *
 * It registers:
 *
 * * `<image>` as a block element in the document schema, and allows `alt`, `src` and `srcset` attributes.
 * * converters for editing and data pipelines.
 * * `'imageInsert'` command.
 *
 * @extends module:core/plugin~Plugin
 */
export default class ImageInline extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ImageInline';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const schema = editor.model.schema;
		const t = editor.t;
		const conversion = editor.conversion;

		schema.register( 'imageInline', {
			isObject: true,
			isInline: true,
			allowWhere: '$text',
			allowAttributes: [ 'alt', 'src', 'srcset' ]
		} );

		conversion.for( 'dataDowncast' )
			.elementToElement( {
				model: 'imageInline',
				view: ( modelElement, { writer } ) => writer.createEmptyElement( 'img' )
			} );

		conversion.for( 'editingDowncast' )
			.elementToElement( {
				model: 'imageInline',
				view: ( modelElement, { writer } ) => toImageWidget(
					createImageViewElement( writer, 'imageInline' ), writer, t( 'inline image widget' )
				)
			} );

		conversion.for( 'downcast' )
			.add( modelToViewAttributeConverter( 'src', 'imageInline' ) )
			.add( modelToViewAttributeConverter( 'alt', 'imageInline' ) )
			.add( srcsetAttributeConverter( 'imageInline' ) );

		conversion.for( 'upcast' )
			.elementToElement( {
				view: getImageTypeMatcher( 'imageInline', editor ),
				model: ( viewImage, { writer } ) => writer.createElement( 'imageInline', { src: viewImage.getAttribute( 'src' ) } )
			} );

		addUpcastImageConverters( conversion );
	}
}

