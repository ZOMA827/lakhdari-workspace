FROM python:3.9

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . .

# Hugging Face يفرض تشغيل السيرفر على منفذ 7860 دائماً
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]