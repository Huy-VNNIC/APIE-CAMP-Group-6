FROM python:3.9-slim
WORKDIR /app
COPY . .
RUN pip install flask gunicorn
RUN echo 'from flask import Flask, request, jsonify, send_from_directory\nimport importlib.util\nimport os\nimport sys\n\napp = Flask(__name__, static_url_path="")\n\nspec = importlib.util.spec_from_file_location("student_module", "main.py")\nstudent_module = importlib.util.module_from_spec(spec)\nspec.loader.exec_module(student_module)\n\n@app.route("/")\ndef index():\n    return send_from_directory(".", "index.html") if os.path.exists("index.html") else "Python App Running"\n\n@app.route("/api")\ndef api():\n    if hasattr(student_module, "main"):\n        result = student_module.main()\n        return jsonify(result)\n    return "No main function found"\n\nif __name__ == "__main__":\n    app.run(host="0.0.0.0", port=8080)' > server.py
CMD ["python", "server.py"]