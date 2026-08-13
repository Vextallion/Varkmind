export type TopicSummary = {
  id: string;
  title: string;
  imageKey: string;
  entryCount: number;
  sortOrder: number;
};

export type TopicEntry = {
  id: string;
  topicId: string;
  term: string;
  definition: string;
  gloss: string;
  example: string;
};

export type TopicSeedEntry = {
  id: string;
  term: string;
  definition: string;
  gloss: string;
  example: string;
};

export type TopicSeedFile = {
  id: string;
  title: string;
  version: number;
  entries: TopicSeedEntry[];
};

export type TopicsIndexTopic = {
  id: string;
  title: string;
  file: string;
  entryCount: number;
  imageKey: string;
};

export type TopicsIndexFile = {
  version: number;
  generatedAt: string;
  topics: TopicsIndexTopic[];
};
