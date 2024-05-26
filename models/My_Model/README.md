---
license: apache-2.0
metrics:
- accuracy
- f1
---
Checks whether an image is real or fake (AI-generated).

See https://www.kaggle.com/code/dima806/deepfake-vs-real-faces-detection-vit for more details.

```
Classification report:

              precision    recall  f1-score   support

        Real     0.9921    0.9933    0.9927     38080
        Fake     0.9933    0.9921    0.9927     38081

    accuracy                         0.9927     76161
   macro avg     0.9927    0.9927    0.9927     76161
weighted avg     0.9927    0.9927    0.9927     76161
```