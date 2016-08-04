export const schema = [`
type Query {
  testString: String
}
schema {
  query: Query
}
`];

export const mocks = {
  String: () => 'It works!',
};
