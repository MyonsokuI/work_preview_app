package com.example.demo.service;

import com.example.demo.dto.answer.AnswerRequest;
import com.example.demo.dto.answer.AnswerResponse;
import com.example.demo.entity.Answer;
import com.example.demo.repository.AnswerRepository;
import com.example.demo.repository.QuestionRepository;
import com.example.demo.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AnswerService {

	private final AnswerRepository answerRepository;
	private final QuestionRepository questionRepository;
	private final UserRepository userRepository;

	public AnswerService(AnswerRepository answerRepository,
			QuestionRepository questionRepository,
			UserRepository userRepository) {
		this.answerRepository = answerRepository;
		this.questionRepository = questionRepository;
		this.userRepository = userRepository;
	}

	// DTO入力 → DTO出力
	public AnswerResponse createAnswer(AnswerRequest request, Integer userId) {

		Answer answer = new Answer();

		answer.setAnswerContent(request.getAnswerContent());

		answer.setQuestion(
				questionRepository.findById(request.getQuestionId())
						.orElseThrow(() -> new RuntimeException("問題が見つかりません")));

		answer.setUser(
				userRepository.findById(userId)
						.orElseThrow(() -> new RuntimeException("ユーザーが見つかりません")));

		answer.setSubmittedAt(LocalDateTime.now());

		Answer saved = answerRepository.save(answer);

		return toResponse(saved);
	}

	public AnswerResponse updateAnswer(Integer id, AnswerRequest request) {

		Answer answer = answerRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("回答が見つかりません"));

		answer.setAnswerContent(request.getAnswerContent());

		Answer saved = answerRepository.save(answer);

		return toResponse(saved);
	}

	public List<AnswerResponse> getMyAnswers(Integer userId) {
		return answerRepository.findByUser_UserId(userId)
				.stream()
				.map(this::toResponse)
				.toList();
	}

	public List<AnswerResponse> getAnswersByQuestion(Integer questionId) {
		return answerRepository.findByQuestion_QuestionId(questionId)
				.stream()
				.map(this::toResponse)
				.toList();
	}

	private AnswerResponse toResponse(Answer answer) {
		AnswerResponse res = new AnswerResponse();
		res.setAnswerId(answer.getAnswerId());
		res.setAnswerContent(answer.getAnswerContent());
		res.setQuestionId(answer.getQuestion().getQuestionId());
		res.setUserId(answer.getUser().getUserId());
		res.setSubmittedAt(answer.getSubmittedAt());
		return res;
	}
}