// Lightweight binary NBT (Named Binary Tag) encoder for Minecraft .schematic export
// Compatible with WorldEdit, Litematica, MCEdit, and Schematica

export function createSchematicNBT(
  width: number,
  height: number,
  length: number,
  blockIds: Uint8Array,
  blockData: Uint8Array = new Uint8Array(width * height * length)
): Uint8Array {
  const parts: Uint8Array[] = [];

  function writeByte(v: number) {
    parts.push(new Uint8Array([v & 0xff]));
  }

  function writeShort(v: number) {
    const buf = new Uint8Array(2);
    new DataView(buf.buffer).setInt16(0, v, false); // Big Endian
    parts.push(buf);
  }

  function writeInt(v: number) {
    const buf = new Uint8Array(4);
    new DataView(buf.buffer).setInt32(0, v, false); // Big Endian
    parts.push(buf);
  }

  function writeString(str: string) {
    const encoded = new TextEncoder().encode(str);
    writeShort(encoded.length);
    parts.push(encoded);
  }

  // Root TAG_Compound ("Schematic")
  writeByte(10); // TAG_Compound
  writeString("Schematic");

  // Short: Width
  writeByte(2); // TAG_Short
  writeString("Width");
  writeShort(width);

  // Short: Height
  writeByte(2); // TAG_Short
  writeString("Height");
  writeShort(height);

  // Short: Length
  writeByte(2); // TAG_Short
  writeString("Length");
  writeShort(length);

  // String: Materials
  writeByte(8); // TAG_String
  writeString("Materials");
  writeString("Alpha");

  // Byte_Array: Blocks
  writeByte(7); // TAG_Byte_Array
  writeString("Blocks");
  writeInt(blockIds.length);
  parts.push(blockIds);

  // Byte_Array: Data
  writeByte(7); // TAG_Byte_Array
  writeString("Data");
  writeInt(blockData.length);
  parts.push(blockData);

  // List: Entities (empty)
  writeByte(9); // TAG_List
  writeString("Entities");
  writeByte(0); // TAG_End element type
  writeInt(0); // 0 elements

  // List: TileEntities (empty)
  writeByte(9); // TAG_List
  writeString("TileEntities");
  writeByte(0); // TAG_End element type
  writeInt(0); // 0 elements

  // TAG_End of root compound
  writeByte(0);

  // Concatenate all parts
  const totalLength = parts.reduce((acc, p) => acc + p.length, 0);
  const out = new Uint8Array(totalLength);
  let offset = 0;
  for (const p of parts) {
    out.set(p, offset);
    offset += p.length;
  }

  return out;
}

// Compress Uint8Array using browser CompressionStream("gzip")
export async function gzipCompress(data: Uint8Array): Promise<Uint8Array> {
  if (typeof CompressionStream !== "undefined") {
    try {
      const stream = new Blob([data as unknown as BlobPart]).stream().pipeThrough(new CompressionStream("gzip"));
      const response = await new Response(stream);
      const buffer = await response.arrayBuffer();
      return new Uint8Array(buffer);
    } catch {
      // Fallback to uncompressed if browser stream fails
      return data;
    }
  }
  return data;
}
