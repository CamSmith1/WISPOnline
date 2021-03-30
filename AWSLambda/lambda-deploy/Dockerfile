FROM python:3.8.6-slim-buster AS python-alpine
ARG FUNCTION_DIR="/home/app/"

RUN apt-get update
RUN apt-get -y install \
    tesseract-ocr \
    poppler-utils \
    ffmpeg \ 
    libsm6 \
    libxext6

# Create function directory
RUN mkdir ${FUNCTION_DIR}
# Copy handler function
COPY app/* ${FUNCTION_DIR}

RUN python3 -m pip install --upgrade pip
RUN python3 -m pip install --upgrade awslambdaric Pillow pytesseract pdf2image opencv-python --target ${FUNCTION_DIR}

WORKDIR ${FUNCTION_DIR}

ADD https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/latest/download/aws-lambda-rie /usr/bin/aws-lambda-rie
RUN chmod 755 /usr/bin/aws-lambda-rie
COPY entry.sh /
RUN chmod 755 /entry.sh
ENTRYPOINT [ "/entry.sh" ]
CMD [ "app.handler" ]