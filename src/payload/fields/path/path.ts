import type { CustomField } from '../../fields/slug/utils/payload-overrides'
import deepmerge from 'deepmerge'

import { generateAndValidatePath } from './hooks/generateAndValidatePath'
import { PathField } from './types'

/**
 * Creates a configuration object for a "path" field in Payload CMS with optional overrides.
 *
 * This function generates a configuration object for a "path" field, which is a text field intended for unique paths.
 * The default configuration includes properties such as `unique`, `index`, and a custom hook for generating and validating
 * the path. It also supports admin-specific settings, including custom field components.
 *
 * The function uses the `deepmerge` utility to combine default field settings with any provided overrides.
 *
 * @param {Partial<CustomField>} [overrides={}] - Optional overrides to customize the default field configuration. These overrides are merged with the default configuration.
 * @returns {CustomField} - The complete field configuration object, including default settings and any provided overrides.
 *
 * @example
 * // Example with custom field settings and overrides
 * const customPathField = pathField({
 *   label: 'Custom Path Label',
 *   admin: {
 *     position: 'main',
 *   },
 * });
 *
 * // The `customPathField` object will contain merged configurations
 * // with the base "path" field settings and the provided overrides,
 * // including a custom label and admin position.
 */
const pathField: PathField = (overrides = {}) =>
  deepmerge<CustomField, Partial<CustomField>>(
    {
      type: 'text',
      name: 'path',
      unique: true,
      index: true,
      label: 'Path',
      hooks: {
        beforeValidate: [generateAndValidatePath],
      },
      admin: {
        position: 'sidebar',
        components: {
          Field: '/src/payload/fields/path/components/CustomPathField.tsx',
        },
      },
    },
    overrides,
  )

export default pathField