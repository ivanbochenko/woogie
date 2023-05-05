import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'http://localhost:8080' + '/graphql',
  documents: ['app/**/*.tsx'],
  ignoreNoDocuments: true,
  generates: {
    './gql/': {
      preset: 'client'
    }
  }
}
 
export default config