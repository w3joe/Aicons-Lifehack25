export enum ResourceType {
  VIDEO = "VIDEO",
  TEXT = "TEXT",
}

export interface Resource {
  resource_id: string;
  lesson_id: string;
  title: string;
  resource_type: ResourceType;
  url_or_content: string;
}
