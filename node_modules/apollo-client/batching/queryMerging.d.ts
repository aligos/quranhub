import { OperationDefinition, Field, FragmentDefinition, FragmentSpread, InlineFragment, Document, SelectionSet, VariableDefinition, Variable, GraphQLResult } from 'graphql';
import { Request } from '../networkInterface';
export declare function mergeRequests(requests: Request[]): Request;
export declare function unpackMergedResult(result: GraphQLResult, childRequests: Request[]): GraphQLResult[];
export declare function createFieldMapsForRequests(requests: Request[]): {
    [index: number]: Field;
}[];
export declare function createFieldMap(selections: (Field | InlineFragment | FragmentSpread)[], startIndex?: number): {
    fieldMap: {
        [index: number]: Field;
    };
    newIndex: number;
};
export declare function parseMergedKey(key: string): {
    requestIndex: number;
    fieldIndex: number;
};
export declare function mergeQueryDocuments(childQueryDocs: Document[]): Document;
export declare function addVariablesToRoot(rootVariables: {
    [key: string]: any;
}, childVariables: {
    [key: string]: any;
}, childQueryDoc: Document, childQueryDocIndex: number): {
    [key: string]: any;
};
export declare function addQueryToRoot(rootQueryDoc: Document, childQueryDoc: Document, childQueryDocIndex: number): Document;
export declare function createEmptyRootQueryDoc(rootQueryName?: string): Document;
export declare function renameFragmentSpreads(selSet: SelectionSet, aliasName: string): SelectionSet;
export declare function renameVariables(selSet: SelectionSet, aliasName: string): SelectionSet;
export declare function applyAliasNameToVariableDefinition(vDef: VariableDefinition, aliasName: string): VariableDefinition;
export declare function applyAliasNameToDocument(document: Document, aliasName: string): Document;
export declare function applyAliasNameToFragment(fragment: FragmentDefinition, aliasName: string, startIndex: number): FragmentDefinition;
export declare function applyAliasNameToTopLevelFields(childQuery: OperationDefinition, aliasName: string, startIndex: number): OperationDefinition;
export declare function getVariableAliasName(varNode: Variable, aliasName: string): string;
export declare function getFragmentAliasName(fragment: FragmentDefinition | FragmentSpread, queryAliasName: string): string;
export declare function getOperationDefinitionName(operationDef: OperationDefinition, requestIndex: number): string;
export declare function aliasField(field: Field, alias: string): Field;
export declare function addPrefixToQuery(prefix: string, query: OperationDefinition): OperationDefinition;
export declare function addPrefixToVariables(prefix: string, variables: {
    [key: string]: any;
}): {
    [key: string]: any;
};
