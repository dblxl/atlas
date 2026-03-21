# Evaluation Metrics for Retrieval Systems

Measuring retrieval quality requires a held-out evaluation set of query/answer pairs and a set of metrics that capture different aspects of ranking quality.

## Recall@K

Recall@K measures the fraction of queries for which the correct answer appears in the top-K retrieved results. A recall@5 of 0.8 means that for 80% of queries, the expected chunk appears somewhere in the first five results.

Recall@K is the most common metric for RAG evaluation because it directly measures whether the language model will have access to the relevant context.

## Mean Reciprocal Rank (MRR)

MRR rewards systems that place the correct answer higher in the ranking. For each query, the reciprocal rank is 1/rank if the correct answer is found, or 0 if it is not found in the top-K results. MRR is the mean of these values across all queries.

A system that always returns the correct answer at rank 1 achieves MRR = 1.0. A system that returns it at rank 2 half the time and misses it the other half achieves MRR = 0.25.

## Normalized Discounted Cumulative Gain (NDCG)

NDCG extends MRR to handle graded relevance. Each result is assigned a relevance score, and the gain is discounted by the log of its rank. NDCG is useful when multiple chunks are partially relevant to a query.

## Precision@K

Precision@K measures the fraction of the top-K results that are relevant. It penalizes systems that return many irrelevant results alongside the correct one.

## Building an Evaluation Set

A good evaluation set has at least 50 query/answer pairs covering diverse topics and difficulty levels. Pairs should be created by domain experts who can identify the exact chunk that best answers each query.
