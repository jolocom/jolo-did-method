import { DIDDocument, DIDResolver, ParsedDID } from "did-resolver";

export function getResolver() {
  async function resolve(
    did: string,
    parsed: ParsedDID,
    didResolver: DIDResolver
  ): Promise<DIDDocument | null> {

    return null
  }

  return { "jolo": resolve }
}