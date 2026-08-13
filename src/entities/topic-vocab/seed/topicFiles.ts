import index from './topics/index.json';

import environment from './topics/environment.json';
import urbanization from './topics/urbanization.json';
import globalization from './topics/globalization.json';
import crime_law from './topics/crime-law.json';
import society from './topics/society.json';
import education_tech from './topics/education-tech.json';
import work from './topics/work.json';
import consumerism from './topics/consumerism.json';
import health from './topics/health.json';
import media from './topics/media.json';
import travel from './topics/travel.json';
import science from './topics/science.json';
import food from './topics/food.json';
import arts from './topics/arts.json';
import family from './topics/family.json';
import slang_idioms from './topics/slang-idioms.json';
import informal from './topics/informal.json';
import advanced_general from './topics/advanced-general.json';
import daily_life from './topics/daily-life.json';
import entertainment from './topics/entertainment.json';
import misc_advanced from './topics/misc-advanced.json';

import type { TopicSeedFile, TopicsIndexFile } from '../model/types';

export const topicsIndex = index as TopicsIndexFile;

export const topicSeedFiles: Record<string, TopicSeedFile> = {
  'environment': environment,
  'urbanization': urbanization,
  'globalization': globalization,
  'crime-law': crime_law,
  'society': society,
  'education-tech': education_tech,
  'work': work,
  'consumerism': consumerism,
  'health': health,
  'media': media,
  'travel': travel,
  'science': science,
  'food': food,
  'arts': arts,
  'family': family,
  'slang-idioms': slang_idioms,
  'informal': informal,
  'advanced-general': advanced_general,
  'daily-life': daily_life,
  'entertainment': entertainment,
  'misc-advanced': misc_advanced,
};
