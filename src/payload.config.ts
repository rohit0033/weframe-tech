// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
// import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder';
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant';

import { Users } from './collections/Users'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    // Your existing collections (Users, Media, etc.)
    // IMPORTANT: Define the 'tenants' collection as shown in the plugin's basic usage
    Users,
    Media,
    {
      slug: 'tenants',
      admin: {
        useAsTitle: 'name',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          unique: true, // Ensure tenant names are unique
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true, // Ensure tenant slugs are unique
        },
        // You can add more tenant-specific fields here if needed
      ],
    },
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    formBuilderPlugin({
      // Configure allowed fields for your form builder
      fields: {
        text: true,
        textarea: true,
        email: true,
        checkbox: true,
        number: true,
        select: true,
        message: true,
        // Add or remove fields as needed
      },
      // Optional: if you have pages or posts collection for redirection
      // redirectRelationships: ['pages'],
    }),
    multiTenantPlugin({
      collections: {
        forms: {}, // Apply multi-tenancy to the 'forms' collection
        'form-submissions': {}, // Apply multi-tenancy to the 'form-submissions' collection
      },
      // Optional: Debug mode to see the tenant field in the admin UI
      debug: process.env.NODE_ENV !== 'production',
      // Optional: Function to determine if a user has access to all tenants (super-admin)
      userHasAccessToAllTenants: ({ user }) => {
        // Example: If your User collection has a role field and 'admin' role
        return user?.role === 'admin';
      },
      useTenantsCollectionAccess: false,
      // Optional: You can customize the tenants array field on the user if needed
      // tenantsArrayField: {
      //   includeDefaultField: true,
      // },
    }),
  ],
})
